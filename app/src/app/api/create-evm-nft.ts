
import { AptosAccount, AptosClient, HexString, TokenClient } from 'aptos';


import { NextApiRequest, NextApiResponse } from 'next';

export type ApiError = {
  message: string;
};

export type CreateAptosTokenBody = {
  receiver: string;
  metadataUri: string;
};

export type CreateAptosTokenResponse = {
  creator: string;
  collectionName: string;
  tokenName: string;
  tokenPropertyVersion: number;
};

const NODE_URL = 'https://fullnode.devnet.aptoslabs.com';

const COLLECTION_NAME = 'Dixit';
const COLLECTION_DESCRIPTION =
  "Dixit Description";
const COLLECTION_URI = 'https://livepeer.org';

const TOKEN_VERSION = 0;
const TOKEN_DESCRIPTION =
  "A video NFT which uses decentralized video transcoding protocol.";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CreateAptosTokenResponse | ApiError>,
) => {
  try {
    const method = req.method;

    if (method === 'POST') {
      const { receiver, metadataUri }: CreateAptosTokenBody = req.body;
      console.log(receiver, metadataUri);
      if (!receiver || !metadataUri) {
        return res.status(400).json({ message: 'Missing data in body.' });
      }

      const client = new AptosClient(NODE_URL);
      const tokenClient = new TokenClient(client);
      console.log(client);
      console.log(tokenClient);

      if (!process.env.APTOS_PRIVATE_KEY) {
        return res.status(500).json({ message: 'Aptos config missing.' });
      }

      const issuer = new AptosAccount(
        new HexString(process.env.APTOS_PRIVATE_KEY).toUint8Array(),
      );
      console.log("issuer");

      let collectionData: any;

      try {
        console.log("fetching collection");

        collectionData = await tokenClient.getCollectionData(
          issuer.address(),
          COLLECTION_NAME,
        );
        console.log(collectionData);

      } catch (e) {
        // if the collection does not exist, we create it
        console.log(issuer, COLLECTION_NAME, COLLECTION_DESCRIPTION, COLLECTION_URI);

        const createCollectionHash = await tokenClient.createCollection(
          issuer,
          COLLECTION_NAME,
          COLLECTION_DESCRIPTION,
          COLLECTION_URI,
        );
        console.log(createCollectionHash);

        await client.waitForTransaction(createCollectionHash, {
          checkSuccess: true,
        });

        collectionData = await tokenClient.getCollectionData(
          issuer.address(),
          COLLECTION_NAME,
        );
        console.log(collectionData);

      }

      // each token increments by 1, e.g. "Video NFT 1"
      const tokenName = `Video NFT ${Number(collectionData?.supply ?? 0) + 1}`;

      const createTokenHash = await tokenClient.createToken(
        issuer,
        COLLECTION_NAME,
        tokenName,
        TOKEN_DESCRIPTION,
        1,
        metadataUri,
      );
      await client.waitForTransaction(createTokenHash, { checkSuccess: true });

      // offer the token to the address in the request body
      // this must be confirmed by the recipient, so this is safe
      // (a random address could be passed in to the POST body)
      //
      // a better way would be to have the recipient sign a payload
      // and confirm that signature in the backend
      const offerTokenHash = await tokenClient.offerToken(
        issuer,
        receiver,
        issuer.address(),
        COLLECTION_NAME,
        tokenName,
        1,
        TOKEN_VERSION,
      );
      await client.waitForTransaction(offerTokenHash, { checkSuccess: true });

      return res.status(200).json({
        creator: issuer.address().hex(),
        collectionName: COLLECTION_NAME,
        tokenName,
        tokenPropertyVersion: TOKEN_VERSION,
      });
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: (err as Error)?.message ?? 'Error' });
  }
};

export default handler;