import styles from "@/components/ui/OrbitLoader.module.css"

type OrbitLoaderProps = {
  className?: string
}

export function OrbitLoader({ className }: OrbitLoaderProps) {
  const loadingWord = "Analyzing"

  return (
    <div
      className={`${styles.loaderWrapper} ${className ?? ""}`.trim()}
      role="status"
      aria-live="polite"
      aria-label="Loading channel analytics"
    >
      <div className={styles.loader} />
      <div className={styles.letterWrapper} aria-hidden="true">
        {loadingWord.split("").map((letter, index) => (
          <span key={`${letter}-${index}`} className={styles.loaderLetter}>
            {letter}
          </span>
        ))}
      </div>
      <span className="sr-only">{loadingWord}</span>
    </div>
  )
}
