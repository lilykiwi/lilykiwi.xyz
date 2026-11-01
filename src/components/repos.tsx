import {
  RepoIcon,
  RepoForkedIcon,
  ArchiveIcon,
  StarFillIcon,
} from './icons'
import type { JSX } from 'preact'
import { useSignal, type Signal } from '@preact/signals'
import { useEffect, useLayoutEffect, useRef } from 'preact/hooks'
import { RepoCard } from './repos/repoCard'

/**
 * @todo: document this
 */
export function TimeFormat(time: number): string {
  const date = new Date(time)
  return date.toLocaleDateString()
}

interface repoData {
  name: string
  description: string
  url: string
  license: string
  stars: number
  is_fork: boolean
  is_archived: boolean
  last_commit: string
  language?: string
}

/**
 * The cards are laid out in CSS columns, so their order in the markup runs down the first column and then the next,
 * which would stagger the entrance column by column. This re-indexes them by where they sit (first of each column,
 * then the second of each, left to right) so it reads row by row.
 */
function staggerByRow(grid: HTMLElement): void {
  const items = [...grid.children] as HTMLElement[]
  const left = (el: HTMLElement) => Math.round(el.getBoundingClientRect().left)
  const columns = [...new Set(items.map(left))].sort((a, b) => a - b)
  const rank = columns.map(() => 0)
  for (const el of items) {
    const c = columns.indexOf(left(el))
    el.style.setProperty('--i', String(Math.min(rank[c]++ * columns.length + c, 12)))
  }
}

/**
 * @todo: document this
 */
export function Repositories(): JSX.Element {
  let fetchedData = useSignal([])
  const grid = useRef<HTMLDivElement>(null)

  // before paint, so the entrance starts with the right delays; the column count follows the width
  useLayoutEffect(() => {
    const el = grid.current
    if (!el) return
    staggerByRow(el)
    const resize = new ResizeObserver(() => staggerByRow(el))
    resize.observe(el)
    return () => resize.disconnect()
  }, [fetchedData.value.length])

  useEffect(() => {
    async function getData() {
      const repos: Response = await fetch(
        'https://api.github.com/users/lilykiwi/repos',
        { cache: 'force-cache' }
      )
      if (repos.status !== 200) {
        return
      }
      const json: any = await repos.json()
      fetchedData.value = json.map((repo: any) => {
        return {
          name: repo.full_name,
          description: repo.description,
          url: repo.html_url,
          license: repo.license?.spdx_id,
          stars: repo.stargazers_count,
          is_fork: repo.fork,
          is_archived: repo.archived,
          last_commit: repo.pushed_at,
          language: repo.language,
        }
      })
    }

    getData()
  }, [])

  if (fetchedData.value.length === 0) {
    return <div class="repoCards"></div>
  }

  return (
    <>
      <div className="repoCards" ref={grid}>
        {fetchedData.value.map((repo: any, i: number) => (
          <RepoCard
            index={i}
            name={repo.name}
            description={repo.description}
            url={repo.url}
            license={repo.license}
            stars={repo.stars}
            is_fork={repo.is_fork}
            is_archived={repo.is_archived}
            language={repo.language}
          />
        ))}
      </div>
    </>
  )
}
