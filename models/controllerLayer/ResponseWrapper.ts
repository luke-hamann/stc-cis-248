export default class ResponseWrapper {
  public body: ReadableStream | Uint8Array | string | null = null;
  public headers: Map<string, string> = new Map<string, string>();
  public status: number | null = null;

  public toResponse() {
    return new Response(this.body, {
      status: this.status ?? 200,
      headers: new Headers(Object.fromEntries(this.headers)),
    });
  }
}
