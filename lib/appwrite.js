import { Avatars, Databases, ID, Query } from "react-native-appwrite";
import { Client } from "react-native-appwrite";
import { Account } from "react-native-appwrite";
export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.justin.program",
  projectId: "66521a4f000891efca5b",
  databaseId: "66521bc20008710ac9d2",
  userCollectionId: "66521bd70008d642fe16",
  videoCollectionId: "66521bf8003683b80eae",
  storageId: "66521d880035e6707e5d",
};

// Init your React Native SDK
const client = new Client();
client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUsers = async (email, password, username) => {
  // Register User
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error("Error creating account");

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      "66521bd70008d642fe16",
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar:avatarUrl
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async(email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    // console.log(response);
    return session;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}



export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw new Error("Error getting account");


        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userColledtionId
            [Query.equal('accountId', currentAccount.$id)]
        ) 

        if(!currentUser) throw new Error("Error getting user");

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}