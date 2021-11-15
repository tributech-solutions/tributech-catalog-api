import * as fs from 'fs';
import * as http2 from 'http2';
import * as _path from 'path';

async function download(
  host,
  query,
  destination
): Promise<{ result: boolean }> {
  return new Promise((resolve, reject) => {
    // Connect to client:
    const client = http2.connect(host);
    client.on('error', (error) => reject(error));

    // Prepare a write stream:
    const fullPath = _path.join(fs.realpathSync('.'), destination);
    const file = fs.createWriteStream(fullPath, { flags: 'w' });
    file.on('error', (error) => reject(error));

    // Create a request:
    const request = client.request({ [':path']: query });

    // On initial response handle non-success (!== 200) status error:
    request.on('response', (headers /*, flags*/) => {
      if (headers[':status'] !== 200) {
        file.close();
        fs.unlink(fullPath, () => {});
        reject(new Error(`Server responded with ${headers[':status']}`));
      }
    });

    // Set encoding for the payload:
    request.setEncoding('utf8');

    // Write the payload to file:
    request.on('data', (chunk) => file.write(chunk));

    // Handle ending the request
    request.on('end', () => {
      file.close();
      client.close();
      resolve({ result: true });
    });

    request.end();
  });
}

async function downloadOpenAPISpecs() {
  const nodeName = 'dev-node-a';

  download(
    `https://twin-api.${nodeName}.dataspace-node.com`,
    '/swagger/v1/swagger.json',
    `tools/schemas/twin-api.json`
  );

  download(
    `https://catalog-api.${nodeName}.dataspace-node.com`,
    '/api-json',
    `tools/schemas/catalog-api.json`
  );
}

downloadOpenAPISpecs();
