import initApp from "./server";
const httpPort = process.env.HTTPPORT;
const  httpsPort = process.env.HTTPSPORT;
import http from 'http';
import https from 'https';
import fs from 'fs';

initApp()
  .then((app) => {
      if (process.env.NODE_ENV !== 'production') {
        http.createServer(app).listen(httpPort, () => {
          console.log(`server is running on port ${httpPort}`);
        });
      } else {
        http.createServer((req, res) => {
          res.writeHead(301, {
            Location: 'https://' + req.headers.host + req.url,
          });
          res.end();
        }).listen(80, () => {
          console.log('Redirecting HTTP to HTTPS');
        });
        const options = {
          key: fs.readFileSync('./client-key.pem'),
          cert: fs.readFileSync('./client-cert.pem'),
        };
        https.createServer(options, app).listen(httpsPort, () => {
          console.log(`server is running on port ${httpsPort}`);
        });
      }
  })
  .catch(() => {
    console.log("Error Fail starting the server");
  });


