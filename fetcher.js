const fs = require('fs');
const request = require('request');
const readline = require('readline');
const args = process.argv.slice(2);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
if (args.length < 2) {
  console.log('Error: needs more arguments.');
  process.exit();
}
request(args[0], (err, response, body) => {
  if (err) {
    console.log(err.message);
    process.exit();
  }
  if (response && response.statusCode > 300 || response.statusCode < 200) {
    console.log('error',response.statusCode);
    process.exit();
  }
  fs.access(args[1],fs.F_OK, (err) => {
    if (!err) {
      rl.question(`File ${args[1]} File already exists. Overwrite? (y/n): `, (answer) => {
        if (!/[yY]/g.test(answer)) {
          console.log('Cancelling write...');
          process.exit();
        }
        fs.writeFile(args[1], body, (err) => {
          if (err) {
            console.log(err.message);
            process.exit();
          }
          console.log(`Downloaded and saved ${body.length} bytes to ${args[1]}`);
        });
        rl.close();
      });
    } else {
      fs.writeFile(args[1], body, (err) => {
        if (err) {
          console.log(err.message);
          process.exit();
        }
        console.log(`Downloaded and saved ${body.length} bytes to ${args[1]}`);
      });
    }
  });
});