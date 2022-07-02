export function createIframeSourceCode({
	title,
	body = '',
	head = '',
	script,
	map,
	params = {}
}: {
	title: string;
	body?: string;
	head?: string;
	script: string;
	map: string;
	params: Record<string, any>;
}) {
	const scriptUrl = URL.createObjectURL(
		new Blob([`${script}\n\n//@ sourceMappingURL=${map}`], { type: 'text/javascript' })
	);

	const code = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>${title}</title>
	${head}
	<style>
		html, body {
			margin: 0;
			padding: 0;
		}
		canvas {
			display: block;
		}
	</style>

	<script>
		window.addEventListener("error", function(e) {
			e.preventDefault();
			parent.postMessage({
				type: 'error',
				data: {
					error: e.error,
					collumn: e.colno,
					line: e.lineno
				}
			})
		});
		const __console__ = window.console;
		const console = window.console = {
			log(...args) {
				parent.postMessage({
					type: 'console.log',
					data: args
				});
			},
			error(...args) {
				parent.postMessage({
					type: 'console.error',
					data: args
				});
			}
		}

		${Object.entries(params)
			.map(([key, val]) => `const ${key} = ${val};`)
			.join('\n\t\t')}
	</script>
</head>
<body>
	${body}
	<script src="${scriptUrl}" type="text/javascript"></script>
</body>
</html>`;

	const content = new Blob([code], { type: 'text/html' });
	return URL.createObjectURL(content);
}
