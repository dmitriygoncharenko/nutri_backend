export function findEnumKeyByValue<
  T extends object,
  U extends keyof T,
  V extends T[U]
>(obj: T, value: V): U | undefined {
  const entries = Object.entries(obj) as [U, V][];
  const foundEntry = entries.find(([key, val]) => val === value);
  return foundEntry ? foundEntry[0] : undefined;
}

export function filterEnumKeysByValue<
  T extends { [key: string]: string },
  U extends keyof T
>(obj: T, filterValues: string[]): U[] {
  return Object.entries(obj)
    .filter(([key, value]) => filterValues.includes(value))
    .map(([key]) => key as U);
}
