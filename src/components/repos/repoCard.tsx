import {
  RepoIcon,
  RepoForkedIcon,
  ArchiveIcon,
  StarIcon,
  LawIcon,
  HistoryIcon,
} from '@primer/octicons-react'
import { JSX } from 'preact'

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
  tags?: string[]
  last_commit: string
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
  tags = [],
  last_commit,
}: repoCardProps): JSX.Element {
  return (
    <a href={url} className="card bg-body-secondary border border-dark-subtle">
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
      <p className="tags">
        {tags.map((tag: string, idx: number) => {
          return (
            <span
              key={tag + '-' + idx}
              className="tag badge bg-dark-subtle border border-dark-subtle text-dark-emphasis rounded-pill"
            >
              {tag}
            </span>
          )
        })}
      </p>
      <p className="repoDescription">{description}</p>
      <p className="repoMeta">
        <span className="stars badge bg-warning-subtle border border-warning-subtle text-warning-emphasis rounded-pill">
          <StarIcon /> {stars}
        </span>
        <span className="commits badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill">
          <HistoryIcon /> {TimeFormat(Date.parse(last_commit))}
        </span>
        {license ? (
          <span className="license badge bg-info-subtle border border-info-subtle text-info-emphasis rounded-pill">
            <LawIcon /> {license}
          </span>
        ) : null}
      </p>
    </a>
  )
}
