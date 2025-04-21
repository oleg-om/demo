import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "src", "styles")],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
