import { Transform } from 'class-transformer';
export function TransformEmail() {
  return Transform(
    ({ value }) => {
      if (value === undefined) return undefined;
      return value.toString().toLowerCase();
    },
    {
      toClassOnly: true,
    },
  );
}
