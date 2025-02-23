import concurrently from "concurrently";

concurrently([
  {
    name: "client",
    prefixColor: "#58c4dc",
    command: "bun client:start",
  },
  {
    name: "server",
    prefixColor: "#fe6f32",
    command: "bun server:start",
  },
]);
