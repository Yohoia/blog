import Image, { type ImageProps } from "next/image";
import dimensions from "@/lib/image-dimensions.json";
type Props = Omit<ImageProps, "src" | "width" | "height"> & {
  src: string;
  width?: number;
  height?: number;
};
export function Media({ src, width, height, alt, ...props }: Props) {
  const size = dimensions[src as keyof typeof dimensions];
  const w = width ?? size?.width ?? 920;
  const h = height ?? (size ? Math.round((w * size.height) / size.width) : w);
  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      width={w}
      height={h}
      unoptimized={src.startsWith("/api/") || /^https?:/.test(src)}
    />
  );
}
