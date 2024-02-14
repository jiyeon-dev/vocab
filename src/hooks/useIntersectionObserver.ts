import { useEffect } from "react";

export default function useIntersectionObserver({
  root,
  target,
  onIntersect,
  threshold = 1.0,
  rootMargin = "0px",
  enabled = true,
}) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && onIntersect()),
      {
        root: root && root.current,
        rootMargin,
        threshold,
      }
    );

    // 관측 시작
    const el = target && target.current;
    if (!el) return;
    observer.observe(el);

    return () => {
      observer && observer.unobserve(el);
    };
  }, [target, enabled, root, threshold, rootMargin, onIntersect]);
}
