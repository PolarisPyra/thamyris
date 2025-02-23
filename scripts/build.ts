import concurrently from "concurrently";

concurrently([
	{
		name: "client",
		prefixColor: "#58c4dc",
		command: "bun client:build",
	},
]);
