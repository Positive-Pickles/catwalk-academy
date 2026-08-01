# Publish Haunted Catwalk Academy from a Private GitHub Repository

This guide explains how to keep the **source repository private** while allowing your daughter to play Haunted Catwalk Academy from a normal web browser.

She will not need Git, Node.js, a command prompt, or any developer tools. After setup, she will open a bookmark like any other website.

## Important privacy distinction

There are two separate things with different visibility settings:

1. **The GitHub repository** contains the source code. This can remain private.
2. **The GitHub Pages website** is the playable game.

With a personal GitHub Pro account, the repository can remain private, but the published Pages website is publicly reachable by anyone who knows or discovers its address. GitHub Pages does not expose the private source repository through the website.

The game does not upload cat names, outfits, answers, or progress. That information remains in the browser's local storage on your daughter's computer.

> A login-protected GitHub Pages website requires a project repository owned by an organization using GitHub Enterprise Cloud. A normal private repository does not make its Pages website private.

## Recommended setup

Use a private repository with GitHub Pages and GitHub Actions. This provides the simplest experience for your daughter while keeping the source code private.

### Requirements

- The repository is located at `reb-eng/3rd-grade-head-start`.
- The repository visibility is **Private**.
- The repository owner has GitHub Pro, GitHub Team, or GitHub Enterprise. GitHub Free only supports Pages from public repositories.
- The project has been committed and pushed to the `main` branch.

The repository already contains the deployment workflow:

```text
.github/workflows/deploy-pages.yml
```

## Part 1: Confirm that the repository is private

1. Sign in to GitHub using the account that owns the repository.
2. Open `https://github.com/reb-eng/3rd-grade-head-start`.
3. Look near the repository name for the **Private** badge.
4. If it says **Public**, open **Settings**.
5. On the **General** page, scroll to **Danger Zone**.
6. Select **Change repository visibility**.
7. Choose **Make private** and complete GitHub's confirmation steps.

Changing repository visibility can affect Pages. Complete the remaining setup after confirming that the repository is private.

## Part 2: Confirm that the files are on GitHub

1. Open the repository's **Code** page.
2. Confirm that it contains `package.json`, `src`, and `.github`.
3. Open `.github/workflows`.
4. Confirm that `deploy-pages.yml` appears there.

If those files do not appear, the local work has not been committed and pushed yet. Do not enable Pages until the project files are visible on GitHub.

## Part 3: Enable GitHub Pages

1. Open the repository on GitHub.
2. Select **Settings**.
3. In the left sidebar, under **Code and automation**, select **Pages**.
4. Find **Build and deployment**.
5. Set **Source** to **GitHub Actions**.
6. Leave the custom-domain field empty unless you own a domain you want to use.
7. If **Enforce HTTPS** is shown, enable it.

GitHub may start the deployment automatically. If it does not, follow Part 4.

## Part 4: Run the deployment

1. Select the repository's **Actions** tab.
2. In the workflow list, select **Deploy Haunted Catwalk Academy**.
3. Select **Run workflow**.
4. Make sure the branch is `main`.
5. Select the green **Run workflow** button.
6. Wait for the workflow to appear in the run list.
7. Open the run and wait for both **build** and **deploy** to show green checkmarks.

The workflow checks the code, creates a production build, and publishes only the compiled website.

## Part 5: Open the website

1. Return to **Settings → Pages**.
2. Select **Visit site**.
3. The expected address is:

   ```text
   https://reb-eng.github.io/3rd-grade-head-start/
   ```

4. Confirm that Haunted Catwalk Academy opens.
5. Complete one short test lesson.
6. Refresh the page and verify that the newly created cat remains in the Academy.

Publication can take several minutes after a successful workflow run. A temporary `404` immediately after deployment usually means GitHub has not finished updating the site.

## Part 6: Set up your daughter's computer

On her computer:

1. Open Chrome, Edge, Firefox, or Safari.
2. Visit `https://reb-eng.github.io/3rd-grade-head-start/`.
3. Confirm that the address begins with `https://`.
4. Bookmark the page.
5. Rename the bookmark to **Haunted Catwalk Academy**.
6. Place the bookmark on the browser's bookmarks bar or favorites bar.
7. If the browser offers **Install app** or **Create shortcut**, you may use it, but installation is optional.

She can now open the game directly from the bookmark. She does not need a GitHub account and should not need to visit the repository.

## Protecting her saved Academy

Cats, outfits, settings, question history, and learning progress are stored only in that browser on that computer.

To preserve them:

- Use the same browser and browser profile each time.
- Do not use private or incognito browsing.
- Do not clear cookies and site data for `reb-eng.github.io`.
- Do not use automated cleanup software that deletes browser site storage.
- Remember that another computer or browser will start with an empty Academy.

At present, clearing browser storage permanently removes the locally saved Academy. Cloud backup and cross-device synchronization are intentionally not enabled because they would require accounts and collection of child data.

## Publishing future updates

After Pages is configured, updates are automatic:

1. Make and test changes locally.
2. Commit the changes to Git.
3. Push the commit to the `main` branch.
4. GitHub automatically runs **Deploy Haunted Catwalk Academy**.
5. Wait for the workflow's green checkmark.
6. Refresh the game in the browser.

Deploying an update does not normally erase local cats or progress. Avoid changing the local-storage key or saved-data structure without a migration.

## If the private repository cannot publish Pages

If GitHub says Pages is unavailable for this private repository, check the account plan:

1. Open your GitHub profile menu.
2. Select **Settings**.
3. Select **Billing and licensing** or **Billing and plans**.
4. Confirm that the repository owner has GitHub Pro or an eligible organization plan.

Do not make the repository public merely to bypass this message unless you intentionally want the source code to be public.

## If the website itself must also be private

A private repository is not enough to restrict the published website. GitHub's access-controlled Pages sites require GitHub Enterprise Cloud and an organization-owned private or internal project repository.

For a family game, paying for an enterprise organization is generally disproportionate. A private home-network server would be more appropriate if the playable URL must not be reachable from the public internet.

## Troubleshooting

### The workflow fails during build

1. Open **Actions → Deploy Haunted Catwalk Academy**.
2. Open the failed run.
3. Expand the failed step and read its error.
4. Fix the project locally, push a new commit, and let the workflow run again.

### The deploy job reports a Pages configuration error

Return to **Settings → Pages** and confirm that **Source** is set to **GitHub Actions**.

### The site opens but has no cats

Progress is browser-specific. Confirm that she is using the same computer, browser, and browser profile where the cats were created.

### A new version does not appear

1. Confirm that the latest Actions run succeeded.
2. Wait several minutes.
3. Refresh the page with `Ctrl+F5` on Windows.
4. If necessary, close and reopen the browser without clearing site data.

## Official GitHub references

- [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Changing the visibility of a GitHub Pages site](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site)
- [Securing GitHub Pages with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
