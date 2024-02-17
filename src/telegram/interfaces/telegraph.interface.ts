export interface TelegraphPageNodeElementInterface {
  tag: string;
  children: (TelegraphPageNodeElementInterface | string)[];
  attrs?: Record<string, string>;
}
export type TelegraphNodeType = TelegraphPageNodeElementInterface | string;

export interface TelegraphPageInterface {
  access_token?: string;
  title: string;
  author_name?: string;
  author_url?: string;
  content: TelegraphNodeType[];
  return_content?: boolean;
}

export interface TelegraphPageResultInterface {
  path: string;
  url: string;
  title: string;
  description: string;
  author_name: string;
  content: TelegraphNodeType[];
  views: number;
  can_edit: boolean;
}

export interface TelegraphPageResponseInterface {
  ok: boolean;
  result: TelegraphPageResultInterface;
}
