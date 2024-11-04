---
share: true
slug: challenges_of_integrating_module_federation
title: Challenges of Integrating Module Federation
---

Looking back, I realize I never fully reflected on my time helping my last company wrangle Module Federation into production. We had big goals: improve the reusability of our shared components, cut down deployment time, and create a streamlined experience for our users. And for that, Module Federation seemed like the golden ticket. Instead of the usual “update and redeploy the npm package” routine, Module Federation could simply pull the latest components straight from a central app. Sounded like magic, right?

Here was the situation: we were building an insurance quoting flow that spanned seven separate apps, each one owned by a different team. These apps each handled their own slice of the user journey, but they all needed certain common elements like headers, discount banners, and various UI components to look and behave consistently across the board. The traditional npm package approach made this tricky, especially when those shared components changed often—sometimes three or four times a day! Each change meant every team had to update the package, push a PR, wait for reviews, and run through their own deployment pipeline. Imagine seven teams doing this over and over…yeah, not exactly agile.

On a good day, the whole update cycle took about two hours, but on a busier day, it could drag out to the end of the day, making it nearly impossible to deploy multiple times without major delays. It was clear we needed a different approach if we wanted to stay agile and keep a consistent user experience across all apps.

That’s where Module Federation came in. The idea? Skip the npm updates and pull components directly from a centralized app as needed. It seemed like the perfect solution to keep things flexible, fast, and in sync across the board. Of course, integrating it into production wasn’t all smooth sailing—it had its own set of challenges, but it was a crucial step toward achieving our goal of a dynamic, cohesive user experience without the usual update bottlenecks.
