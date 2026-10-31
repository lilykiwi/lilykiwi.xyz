import {
  RepoIcon,
  RepoForkedIcon,
  ArchiveIcon,
  StarFillIcon,
} from '../icons'
import type { JSX } from 'preact'

/**
 * @todo: document this
 */
export function TimeFormat(time: number): string {
  const date = new Date(time)
  return date.toLocaleDateString()
}

/**
 * @todo: document this
 */
interface repoCardProps {
  name: string
  description: string
  url: string
  license?: string
  stars: number
  is_fork: boolean
  is_archived: boolean
  language?: string
  index?: number
}

/**
 * @todo: document this
 */
export function RepoCard({
  name,
  description,
  url,
  license,
  stars,
  is_fork,
  is_archived,
  language,
  index = 0,
}: repoCardProps): JSX.Element {
  return (
    <a href={url} className="card" style={{ '--i': Math.min(index, 12) }}>
      <p className="repoTitle">
        <span className="repoIcon">
          {is_archived ? (
            <ArchiveIcon />
          ) : is_fork ? (
            <RepoForkedIcon />
          ) : (
            <RepoIcon />
          )}
        </span>
        <span className="name">{name}</span>
      </p>
      <p className="repoDescription">{description}</p>
      <p className="repoMeta">
        <span className="stars badge">
          <StarFillIcon /> {stars}
        </span>
        {language ? <span className="language badge">{language}</span> : null}
        {license ? (
          <span className="license badge">{license}</span>
        ) : null}
      </p>
    </a>
  )
}
