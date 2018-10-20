const fs = require("fs");
const cheerio = require("cheerio");

const ids = require("./list");
const html = fs.readFileSync("./table.html", { encoding: "utf8" });
const $ = cheerio.load(html, { normalizeWhitespace: true });

let records = [];

const table = $("table tbody").html();
const targets = $("button", table);

return fs.writeFileSync("list.json", JSON.stringify(ids));
// return console.log(ids);

// Go through the aggragated list and get details.
ids.forEach(id => {
  let record = { id: id };

  const body = $(`tr[id=${id}]`).html();
  const rows = $("div[class='row']", body);

  $(rows).each((i, row) => {
    switch (i) {
      case 0: {
        const text = $(row).text();
        record["beneficiaryName"] = text;
        break;
      }
      case 1: {
        const text = $(row).text();
        record["address1"] = text;
        break;
      }
      case 2: {
        const text = $(row).text();
        record["address2"] = text;
        break;
      }
      case 3: {
        const text = $(row).text();
        record["title"] = text;
        break;
      }
      case 4: {
        const text = $(row).text();
        record["reference"] = text;
        break;
      }
      case 5: {
        const details = $("div[class='']", row);
        $(details).each((j, detail) => {
          switch (j) {
            case 0: {
              const description = $(detail).text();
              record["description"] = description.replace(
                /\n                  /g,
                ""
              );
              break;
            }
            case 1: {
              const data = $("div.col-md-6 h5", detail);
              $(data).each((k, d) => {
                switch (k) {
                  case 1: {
                    record["duration"] = $(d).text();
                  }
                  case 3: {
                    record["credits"] = $(d).text();
                  }
                }
              });

              break;
            }
            case 2: {
              const data = $("div.col-md-6 h5", detail);
              $(data).each((k, d) => {
                switch (k) {
                  case 1: {
                    record["completion"] = $(d).text();
                  }
                  case 3: {
                    record["type"] = $(d).text();
                  }
                }
              });

              break;
            }
            case 4: {
              const names = $("div.col-md-6", detail);

              $(names).each((k, d) => {
                switch (k) {
                  case 1: {
                    record["contact name"] = $(d).text();
                  }
                }
              });

              const address = $(".col-md-10", detail).text();
              record["contact address"] = address;

              break;
            }
            case 5: {
              const furtherContacts = $("div.col-md-6", detail);

              $(furtherContacts).each((k, d) => {
                switch (k) {
                  case 1: {
                    record["contact phone"] = $(d).text();
                  }
                }
              });

              const address = $(".col-md-10", detail).text();
              record["contact email"] = address;

              break;
            }
          }
        });
        break;
      }
    }
  });

  records.push(record);
});
