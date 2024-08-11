async function delay(ms) {
  return await new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

export default delay;
