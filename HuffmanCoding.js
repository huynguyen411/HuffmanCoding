const fs = require("fs");

function calculateFrequency(data) {
  const frequencyMap = new Map();
  for (let i = 0; i < data.length; i++) {
    const byte = data[i];
    if (frequencyMap.has(byte)) {
      frequencyMap.set(byte, frequencyMap.get(byte) + 1);
    } else {
      frequencyMap.set(byte, 1);
    }
  }
  return frequencyMap;
}

// read file input to byte array. Input could be text, image or video,...
function readBinaryFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const byteArray = new Uint8Array(data);
        resolve(byteArray);
      }
    });
  });
}

// encode file by using of codeMap, return binary string
function encodeFile(data, codeMap) {
  let encodedData = "";
  for (let i = 0; i < data.length; i++) {
    encodedData += codeMap.get(data[i]);
  }
  return encodedData;
}

// convert a binary string to a byte array
function binaryStringToByteArray(binaryString) {
  const byteArray = [];
  for (let i = 0; i < binaryString.length; i += 8) {
    const byte = binaryString.substring(i, i + 8);
    byteArray.push(parseInt(byte, 2));
  }
  return t = new Uint8Array(byteArray);
}

// decode binary encode data, return byte array
function decodeFile(encodedData, root) {
  let decodedBytes = [];
  let currentNode = root;

  for (let i = 0; i < encodedData.length; i++) {
    currentNode = encodedData[i] === "0" ? currentNode.left : currentNode.right;

    if (currentNode.byte !== null) {
      decodedBytes.push(currentNode.byte);
      currentNode = root;
    }
  }

  return Uint8Array.from(decodedBytes);
}

// Huffman Node in Huffman tree
class HuffmanNode {
  constructor(byte, frequency, left = null, right = null) {
    this.byte = byte;
    this.frequency = frequency;
    this.left = left;
    this.right = right;
  }
}

// generate huffman codes for each byte in the data, return codeMap
function generateCodes(node, code = "", codeMap = new Map()) {
  if (node.byte !== null) {
    codeMap.set(node.byte, code);
  } else {
    generateCodes(node.left, code + "0", codeMap);
    generateCodes(node.right, code + "1", codeMap);
  }
  return codeMap;
}

// Huffman tree in Huffman coding
class HuffmanNodeTree {
  constructor(data) {
    this.data = data;
    this.root = this.buildTree();
  }
  buildTree() {
    const frequencyMap = calculateFrequency(this.data);
    const nodes = [...frequencyMap.entries()].map(
      ([byte, frequency]) => new HuffmanNode(byte, frequency)
    );

    while (nodes.length > 1) {
      nodes.sort((a, b) => a.frequency - b.frequency);
      const left = nodes.shift();
      const right = nodes.shift();
      const parent = new HuffmanNode(
        null,
        left.frequency + right.frequency,
        left,
        right
      );
      nodes.push(parent);
    }
    return nodes[0];
  }
}

// convert byte array to text
function byteArrayToText(byteArray) {
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(byteArray);
}

async function processFile(filePath) {
  try {
    const originalByteArray = await readBinaryFile(filePath);
    console.log(originalByteArray.length);

    // build huffman tree
    const huffmanTree = new HuffmanNodeTree(originalByteArray);

    // build code map
    const codeMap = generateCodes(huffmanTree.root);

    // Encode the file
    const encodedData = encodeFile(originalByteArray, codeMap);

    // Convert binary string to byte array
    const encodedByteArray = binaryStringToByteArray(encodedData);
    console.log(encodedByteArray.length);

  } catch (error) {
    console.error("Error processing file:", error);
  }
}

//processFile(input file path here);
