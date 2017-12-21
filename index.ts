import * as fs from "fs"
import * as dns from "dns"

const INPUT_FILE = "./domains.txt";
const OUTPUT_FILE = "hosts.txt";

function resolve4Promise(domain: string): Promise<string> {
    return new Promise((resolve, reject) => {
        dns.resolve4(domain, (err, addresses) => {
            if (err) return reject(err);
            resolve(addresses[0]);
        });
    });
}

(async function () {
    var domains = fs.readFileSync(INPUT_FILE)
        .toString()
        .split("\n")
        .map(line => line.trim());

    if (fs.existsSync(OUTPUT_FILE)) {
        fs.unlinkSync(OUTPUT_FILE);
    }

    for (let domain of domains) {
        domain = domain.trim();
        if (domain.length == 0) continue;
        try {
            var ip = await resolve4Promise(domain);
            console.error(`${domain}: ${ip}`);
            fs.appendFileSync(OUTPUT_FILE, `${ip} ${domain}\r\n`);
        } catch (error) {
            console.error(`${domain}: ${error.message}`);
        }
    }
})();