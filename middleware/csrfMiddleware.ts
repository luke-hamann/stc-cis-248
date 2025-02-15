export default function csrfMiddleware(
  _request: Request,
  _context: IAppContext,
): Promise<IAppContext | Response> {
  return Promise.resolve({
    csrf: "joe",
  });
}
