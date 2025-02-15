import nunjucks from "npm:nunjucks";

nunjucks.configure(".", { noCache: true });

export function HTMLResponse(view: string, model: unknown) {
  return new Response(nunjucks.render(view, { model }), {
    headers: new Headers({ "Content-Type": "text/html" }),
  });
}

export function RedirectResponse(url: string) {
  return new Response("", {
    status: 302,
    headers: new Headers({ "Location": url }),
  });
}
