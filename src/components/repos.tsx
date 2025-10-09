import { RepoIcon, RepoForkedIcon, ArchiveIcon, StarIcon, LawIcon, HistoryIcon } from '@primer/octicons-react';
import { JSX } from 'preact';
import { useSignal, Signal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

/**
 * @todo: document this
 */
export function TimeFormat(time: number): string {
  const date = new Date(time);
  return date.toLocaleDateString();
}


/**
 * @todo: document this
 */
export function Repositories(): JSX.Element {

  let fetchedData = useSignal([]);

  useEffect(() => {
    async function getData() {
      const repos: Response = await fetch("https://api.github.com/users/lilykiwi/repos", { cache: "force-cache" });
      if (repos.status !== 200) {
        return;
      }
      const json: any = await repos.json();
      fetchedData.value = json.map((repo: any) => {
        return ({
          name: repo.full_name,
          description: repo.description,
          html_url: repo.html_url,
          license: repo.license?.spdx_id,
          stars: repo.stargazers_count,
          is_fork: repo.fork,
          is_archived: repo.archived,
          tags: repo.topics,
          last_commit: repo.pushed_at,
        });
      });
    }

    getData();
  }, [fetchedData]);

  if (fetchedData.value.length === 0) {
    return <div class="repoCards"></div>;
  }

  return <div class="repoCards" >      
    {fetchedData.value.map((repo: any) => (
      <a href={repo.html_url} class="card bg-body-secondary border border-dark-subtle">
        <p class="repoTitle">
          <span class="repoIcon">
            {repo.is_archived ?
              <ArchiveIcon /> :
              repo.is_fork ?
                <RepoForkedIcon /> :
                <RepoIcon />}
          </span>
          <span class="name">
            {repo.name}
          </span>
        </p>
        <p class="tags">
          {repo.tags.map((tag: string) => {
            return (
              <span class="tag badge bg-dark-subtle border border-dark-subtle text-dark-emphasis rounded-pill">
                {tag}
              </span>
            );
          })}
        </p>
        <p class="repoDescription">{repo.description}</p>
        <p class="repoMeta">
          <span class="stars badge bg-warning-subtle border border-warning-subtle text-warning-emphasis rounded-pill">
            <StarIcon /> {repo.stars}
          </span>
          <span class="commits badge bg-primary-subtle border border-primary-subtle text-primary-emphasis rounded-pill">
            <HistoryIcon /> {TimeFormat(Date.parse(repo.last_commit))}
          </span>
          {repo.license ?
            <span class="license badge bg-info-subtle border border-info-subtle text-info-emphasis rounded-pill">
              <LawIcon /> {repo.license}
            </span> : ""
          }
        </p>
      </a>
    ))}
  </div>;
}
