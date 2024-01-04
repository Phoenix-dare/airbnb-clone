export { default } from "next-auth/middleware";

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";



export function middleware(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }

  return NextResponse.next();
}

function isAuthenticated(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");

  if (!authHeader) {
    return false;
  }

  const encodedCredentials = authHeader.split(" ")[1];
  const decodedCredentials = atob(encodedCredentials);
  const [user, pass] = decodedCredentials.split(":");

  const authUser = process.env.AUTH_USER;
  const authPass = process.env.AUTH_PASS;

  if (user === authUser && pass === authPass && user !== null && pass !== null) {
    return true;
  } else {
    return false;
  }
}


function redirectIfNotAuthenticated(req: NextRequest) {
  if (!isAuthenticated(req)) {
    window.location.href = "/"; 
  }
}

export const config = {
  matcher: ["/", "/trips", "/reservations", "/properties", "/favorites"],
};
