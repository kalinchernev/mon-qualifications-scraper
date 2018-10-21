const fs = require("fs");
const cheerio = require("cheerio");

const ids = require("./list");
const html = fs.readFileSync("./table.html", { encoding: "utf8" });
const $ = cheerio.load(html, { normalizeWhitespace: true });

const records = [];

// Go through the aggragated list and get details.
ids.forEach(id => {
  let record = { id: id };

  const body = $(`tr[id=${id}]`).html();
  const rows = $("div[class='row']", body);

  $(rows).each((i, row) => {
    switch (i) {
      case 0: {
        const text = $(row).text();
        record["organisation"] = text
          .replace(/\r?\n|\r/g, "")
          .replace(/ +(?= )/g, "")
          .trim();
        break;
      }
      case 1: {
        const text = $(row).text();
        record["address1"] = text
          .replace(/\r?\n|\r/g, "")
          .replace(/ +(?= )/g, "")
          .trim();
        break;
      }
      case 2: {
        const text = $(row).text();
        record["address2"] = text
          .replace(/\r?\n|\r/g, "")
          .replace(/ +(?= )/g, "")
          .trim();
        break;
      }
      case 3: {
        const text = $(row).text();
        record["programme"] = text
          .replace(/\r?\n|\r/g, "")
          .replace(/ +(?= )/g, "")
          .replace(/Програма: /g, "")
          .trim();
        break;
      }
      case 4: {
        const text = $(row).text();
        record["reference"] = text
          .replace(/\r?\n|\r/g, "")
          .replace(/ +(?= )/g, "")
          .trim();
        break;
      }
      case 5: {
        const details = $("div[class='']", row);
        $(details).each((j, detail) => {
          switch (j) {
            case 0: {
              const description = $(detail).text();
              record["description"] = description
                .replace(/\r?\n|\r/g, "")
                .replace(/ +(?= )/g, "")
                .replace(/Кратко описание /g, "")
                .trim();
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
                    record["completion"] = $(d)
                      .text()
                      .replace(/\r?\n|\r/g, "")
                      .replace(/ +(?= )/g, "")
                      .split(";")
                      .filter(a => a)
                      .map(b => b.trim());
                  }
                  case 3: {
                    record["type"] = $(d)
                      .text()
                      .replace(/\r?\n|\r/g, "")
                      .replace(/ +(?= )/g, "");
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
                    record["contact phones"] = $(d)
                      .text()
                      .split(";")
                      .filter(a => a)
                      .map(b => b.trim());
                  }
                }
              });

              const address = $(".col-md-10", detail)
                .text()
                .split(";")
                .filter(a => a)
                .map(b => b.trim());
              record["contact emails"] = address;

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

fs.writeFileSync("./results.json", JSON.stringify({ data: records }));
