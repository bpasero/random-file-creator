const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\r\n";

function randomChar() {
  return alphabet[randomInt(alphabet.length)];
}

function randomInt(bound) {
  return Math.floor(Math.random() * bound);
}

function randomStr(len) {
  if (len === null) {
    len = 10;
  }
  return (function () {
    let j, ref;
    const results = [];
    for (j = 1, ref = len; 1 <= ref ? j < ref : j > ref; 1 <= ref ? j++ : j--) {
      results.push(randomChar());
    }
    return results;
  })().join("");
}

const button = document.createElement("button");
button.textContent = "Pick a directory";
window.document.body.appendChild(button);

const randomContents = [];
for (let i = 0; i < 1000; i++) {
  randomContents.push(randomStr(10000));
}

button.onclick = async () => {
  const result = await window.showDirectoryPicker();
  if (!result) {
    return;
  }

  const dirHandle = result;

  const start = Date.now();
  const promises = [];

  for (let i = 0; i < 1000; i++) {
    promises.push(
      (async () => {
        const fileHandle = await dirHandle.getFileHandle(`somefile-${i}.txt`, {
          create: true,
        });
        const writable = await fileHandle.createWritable();
        await writable.write(randomContents[i]);
        await writable.close();
      })()
    );
  }

  await Promise.allSettled(promises);

  window.alert(`Took ${Date.now() - start}ms to create 1000 files`);
};
