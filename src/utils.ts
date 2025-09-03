export function GenerateHash(len: number): string {
  const options = "vcgvhhsuhujqcshduoey862373r";
  const length = options.length;

  let ans = "";

  for (let i = 0; i < len; i++) {
    ans += options[Math.floor(Math.random() * length)];
  }

  return ans;
}
