import {
  RepoIcon,
  RepoForkedIcon,
  ArchiveIcon,
  StarFillIcon,
} from './icons'
import type { JSX } from 'preact'
import { useSignal, type Signal } from '@preact/signals'
import { useEffect } from 'preact/hooks'
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
 * @todo: document this
 */
export function Repositories(): JSX.Element {
  let fetchedData = useSignal([])

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
      <div className="repoCards">
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
