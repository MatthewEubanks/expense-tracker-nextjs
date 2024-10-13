import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export const checkUser = async () => {
  const user = await currentUser();
  //console.log('user :>> ', user);
  //check for current logged-in user
  if (!user) {
    return null;
  }

  // check if the user is already in the database
  const loggedInUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
  });

  // if user is in database then return user
  if (loggedInUser) {
    return loggedInUser;
  }

  // if not in database then create a new user in the database
  const newUser = await db.user.create({
    data: {
      clerkUserId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });
  return newUser;
};
