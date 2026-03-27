import styles from "@/components/ui/OrbitLoader.module.css"

type OrbitLoaderProps = {
  className?: string
}

export function OrbitLoader({ className }: OrbitLoaderProps) {
  return (
    <div
      className={className}
      role="status"
      aria-live="polite"
      aria-label="Loading channel analytics"
    >
      <svg
        className={styles.loader}
        x="0px"
        y="0px"
        viewBox="0 0 40 40"
        height="40"
        width="40"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          className={styles.track}
          fill="none"
          strokeWidth="4"
          pathLength="100"
          d="M29.76 18.72c0 7.28-3.92 13.6-9.84 16.96c-2.88 1.68-6.24 2.64-9.84 2.64c-3.6 0-6.88-.96-9.76-2.64c0-7.28 3.92-13.52 9.84-16.96c2.88-1.68 6.24-2.64 9.76-2.64s6.96.96 9.84 2.64c5.84 3.36 9.76 9.68 9.84 16.96c-2.88 1.68-6.24 2.64-9.76 2.64c-3.6 0-6.88-.96-9.84-2.64c-5.84-3.36-9.76-9.68-9.76-16.96c0-7.28 3.92-13.6 9.76-16.96c5.84 3.36 9.76 9.68 9.76 16.96z"
        />
        <path
          className={styles.car}
          fill="none"
          strokeWidth="4"
          pathLength="100"
          d="M29.76 18.72c0 7.28-3.92 13.6-9.84 16.96c-2.88 1.68-6.24 2.64-9.84 2.64c-3.6 0-6.88-.96-9.76-2.64c0-7.28 3.92-13.52 9.84-16.96c2.88-1.68 6.24-2.64 9.76-2.64s6.96.96 9.84 2.64c5.84 3.36 9.76 9.68 9.84 16.96c-2.88 1.68-6.24 2.64-9.76 2.64c-3.6 0-6.88-.96-9.84-2.64c-5.84-3.36-9.76-9.68-9.76-16.96c0-7.28 3.92-13.6 9.76-16.96c5.84 3.36 9.76 9.68 9.76 16.96z"
        />
      </svg>
      <span className="sr-only">Loading</span>
    </div>
  )
}
