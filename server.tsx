import MainMenu from "./src/menus/mainMenu";
import type { Menu } from "./src/types/Menu";
import initDb from "./src/utils.ts/initDB";

const db = await initDb();

const activeMenu = await MainMenu(db);

const htmlRenderer = (msgQueue: string[]) => {
  return {
    error: (line) => msgQueue.push(`<h1>${line}</h1>`),
    line: (line) => msgQueue.push(`<h1>${line}</h1>`),
    table: (table) => {
      if (Array.isArray(table)) {
        const columns = new Set<string>();

        table.forEach((item) => {
          Object.keys(item).forEach((key) => columns.add(key));
        });

        const columnsArray = Array.from(columns.values());
        return msgQueue.push(
          `<table id="mapping-table">
            <thead>
              <tr>
              <th>Roll</th>
              ${columnsArray.map((item) => {
                return `
                  <th>${item}</th>
                `;
              })}
              </tr>
            </thead>
            <tbody>
            ${table
              .map((item, key) => {
                return `
                  <tr>
                    <td>${key}</td>
                    ${columnsArray.map((column) => {
                      if (item[column] === undefined) return "";
                      return `
                        <td>${item[column]}</td>
                      `;
                    })}
                  </tr>
                `;
              })
              .join("")}
            </tbody>
          </table>`,
        );
      }
      msgQueue.push(
        `<table id="mapping-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Shortcut</th>
              <th>Option</th>
            </tr>
          </thead>
          <tbody>
          ${Object.entries(table)
            .map(([key, { Shortcut, Options }]) => {
              return `
                <tr>
                  <td>${key}</td>
                  <td><span class="badge">${Shortcut}</span></td>
                  <td>${Options}</td>
                </tr>
              `;
            })
            .join("")}
          </tbody>
        </table>`,
      );
    },
  };
};

const server = Bun.serve({
  port: process.env.PORT ?? 3000,
  hostname: "0.0.0.0",
  async fetch(req, server) {
    const host = req.headers.get("host");
    const wsUrl = process.env.WS_URL ?? `wss://${host}`;
    const success = server.upgrade(req, { data: { activeMenu } });
    if (success) return undefined;

    const html = await Bun.file("./src/web/index.html").text();
    const injected = html.replace(
      "<head>",
      `<head><script>window.__ENV__ = { WS_URL: ${JSON.stringify(wsUrl)} };</script>`,
    );
    return new Response(injected, {
      headers: { "Content-Type": "text/html" },
    });
  },
  websocket: {
    // TypeScript: specify the type of ws.data like this
    data: { activeMenu } as { activeMenu: Menu },

    open(ws) {
      const msgQueue: string[] = [];
      ws.data.activeMenu.render(htmlRenderer(msgQueue));
      ws.send(msgQueue.join(""));
    },
    async message(ws, message) {
      console.log(message);
      ws.data.activeMenu = await ws.data.activeMenu.parseInput(
        message as string,
      );
      const msgQueue: string[] = [];
      await ws.data.activeMenu.render(htmlRenderer(msgQueue));
      ws.send(msgQueue.join(""));
      // the server re-broadcasts incoming messages to everyone
    },
    close(ws) {},
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
