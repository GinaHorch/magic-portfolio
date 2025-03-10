import fs from "fs";
import path from "path";
import matter from "gray-matter";

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn?: string;
};

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  pdf?: string;
  tag?: string;
  team: Team[];
  link?: string;
  linkGithubFrontend?: string;
  linkGithubBackend?: string;
  linkLive?: string;
  linkScrum?: string;
  linkSAFe?: string;
  linkManifesto?: string;
};

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    throw new Error(`Directory not found: ${dir}`);
  }

  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const metadata: Metadata = {
    title: data.title || "",
    publishedAt: data.publishedAt,
    summary: data.summary || "",
    image: data.image || "",
    images: data.images || [],
    pdf: data.pdf || "",
    tag: data.tag || [],
    team: data.team || [],
    link: data.link || "",
    linkGithubFrontend: data.linkGithubFrontend || "",
    linkGithubBackend: data.linkGithubBackend || "",
    linkLive: data.linkLive || "",
    linkScrum: data.linkScrum || "",
    linkSAFe: data.linkSAFe || "",
    linkManifesto: data.linkManifesto || "",
  };

  return { metadata, content };
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getPosts(customPath = ["", "", "", ""]) {
  const resourcesDir = path.join(process.cwd(), ...customPath);
  return getMDXData(resourcesDir);
}
