export async function onValidSeedInfo(seed) {
  if (seed.seedFamily == null || seed.seedFamily == "")
    return "Seed Family can not be blank or empty";
  if (seed.seedName == null || seed.seedName == "")
    return "Send Name can not be blank or empty";

  return null;
}
