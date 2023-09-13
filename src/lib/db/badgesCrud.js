import { generateBlankBadge } from "@/lib/gfx/image";

export async function findBadgebyId(collection, badgeId) {
  return collection.find({ currentId: parseInt(badgeId) }).toArray();
}

export async function findBadgebyMac(collection, mac) {
  return collection.find({ macAddress: mac }).toArray();
}

export async function updateBadgebyId(collection, badgeId, badgeData) {
  return collection.updateOne(
    { currentId: parseInt(badgeId) },
    {
      $set: {
        lastUpdate: new Date(),
        userData: {
          ...badgeData,
        },
      },
    }
  );
}

export async function resetBadgeById(collection, badgeId) {
  const image = await generateBlankBadge(badgeId);
  const badgeData = {
    name: "",
    pronouns: "",
    affiliation: "",
    message: "",
    image: image,
  }

  return collection.updateOne(
    { currentId: parseInt(badgeId) },
    {
      $set: {
        lastUpdate: new Date(),
        userData: {
          ...badgeData,
        },
      },
    }
  );
}

export async function createBadgeByMac(collection, macAddress) {
  const badgeId = (await collection.countDocuments()) + 1;
  const image = await generateBlankBadge(badgeId);

  return collection.insertOne({
    macAddress: macAddress,
    currentId: badgeId,
    lastUpdate: new Date(),
    userData: {
      name: "",
      pronouns: "",
      affiliation: "",
      message: "",
      image: image,
    },
  });
}
