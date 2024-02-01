import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";
import { JwtPayload } from "../interfaces/jwt.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://nutrinetic-dev.us.auth0.com/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: "nutrinetic-api",
      issuer: "https://nutrinetic-dev.us.auth0.com/",
      algorithms: ["RS256"],
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    const minimumScope = ["openid", "profile", "email", "offline_access"];

    if (
      payload?.scope
        ?.split(" ")
        .filter((scope) => minimumScope.indexOf(scope) > -1).length !==
      minimumScope.length
    ) {
      throw new UnauthorizedException(
        `JWT does not possess the required scope (${minimumScope.join(", ")}).`
      );
    }

    return payload;
  }
}
