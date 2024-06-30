import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.davguett.agendalocal",
  projectId: "667df065003a194fd672",
  databaseId: "667df17c0016b97bc0e2",
  userCollectionId: "667df1a00026154f7d11",
  locationCollectionId: "667df1c600152a87e175",
  eventCollectionId: "667df2b2001df090d0f3",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Upload File

// Get File Preview

// Create Video Post

// Get all video Posts
export async function getAllEvents() {
  try {
    const events = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.eventCollectionId
    );

    return events.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts created by user

// Get video posts that matches search query
export async function searchEvents(query) {
  try {
    const events = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.eventCollectionId,
      [Query.search("title", query)]
    );

    if (!events) throw new Error("Algo deu errado");

    return events.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get latest created video posts
