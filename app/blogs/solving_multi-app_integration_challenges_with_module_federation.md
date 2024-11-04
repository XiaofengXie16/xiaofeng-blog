---
share: true
slug: solving_multi-app_integration_challenges_with_module_federation
title: Solving Multi-App Integration Challenges with Module Federation
---
When we set out to streamline our multi-app setup, we knew we needed a solution that could handle component sharing with ease and make the user experience smooth across the board. Enter Module Federation—the answer to all our multi-app headaches! It offered a way to tackle two major problems: keeping shared components consistent without driving ourselves crazy, and making app transitions feel seamless and effortless.

## The Problems We Wanted to Solve

###  Keeping Shared Components Consistent (Without Losing Our Minds)

Our insurance quoting flow involved seven separate apps, each managed by a different team. Every time we updated a shared component—like a header or error message banner—each team had to go through the same steps: update the npm packages, review pull request changes, test, and finally deploy. This rinse-and-repeat cycle often happened multiple times a day, turning simple updates into a tedious process. It was a huge time sink, and if even one team missed an update, users might see inconsistent information across apps—not exactly the polished experience we wanted.

###  Making Navigation Feel Smooth (Instead of a Jolt Between Apps)

Then, there was the issue of navigation. Each app functioned like its own mini-site, so moving from one app to another felt like jumping between separate worlds, complete with loading delays and that all-too-familiar “page reset” feeling. For users, this was a clunky experience. We wanted something that made transitions feel natural and smooth, like moving fluidly from one step to the next—no more jarring stops or reloads along the way.

##  Exploring the Options (and Why We Chose Module Federation)

With these goals in mind, we explored several potential solutions.

### IFrame:

**Pros:**
- **Isolation**: Each app remains fully independent, so changes in one app don’t directly impact others.
- **Easy Setup**: Embedding apps with iframes is straightforward and requires minimal setup.

**Cons:**
- **User Experience and Performance Issues**: Since iframes load each app as a separate page, navigation between apps felt slow and disconnected. Each transition triggered a full page load, interrupting the user experience.
- **Limited Communication**: While `postMessage` enables some cross-iframe communication, it’s clunky and difficult to scale for complex interactions.
- **Styling and Responsiveness Challenges**: Maintaining a cohesive look and responsive design across embedded apps is tricky, often leading to inconsistent styles and user experiences.

### Web Components:

**Pros:**
- **Reusable and Framework-Agnostic**: Web Components are encapsulated and can be used across frameworks, making them highly reusable.
- **Consistency**: As long as components are up to date, Web Components can provide a consistent look and behavior across apps.

**Cons:**
- **Lacks Dynamic Updating**: Web Components don’t support live updates across apps. Each app would still need to pull and deploy updates, leaving us with the same deployment bottlenecks.
- **Dependency Management Complexity**: Cross-app synchronization would require additional infrastructure for managing versions and dependencies, adding complexity.
- **Limited Orchestration**: While Web Components are great for encapsulation, they don’t handle navigation or seamless transitions between apps—features we needed for a unified user experience.

### Webpack Module Federation:

**Pros:**
- **Dynamic Loading**: Module Federation allows apps to fetch the latest shared components on demand, eliminating the need for constant npm updates and redeployments.
- **Seamless Navigation**: With an app shell setup, Module Federation enabled smooth transitions between apps. The app shell could pre-load assets for the next app, making navigation feel fast and uninterrupted.
- **Integrated with Webpack 5**: As a native Webpack 5 feature, Module Federation offers built-in support for code sharing and dynamic imports, reducing setup complexity.

**Cons:**
- **Webpack Dependency**: Module Federation requires Webpack 5, so it may not work seamlessly with non-Webpack environments. Adapting it for different build tools might require additional adjustments.
- **Early-Stage Tooling**: At the time, Module Federation was a relatively new technology (in beta), so best practices and dev tools were still limited, requiring some trial and error on our part.

After weighing the pros and cons, we decided to go with Module Federation. It was the most promising solution for our challenges, and since Webpack was already widely used across teams, it fit smoothly into our existing workflows.

## How Module Federation Made It All Work

Module Federation allowed us to tackle our challenges in a big way. Here’s how it transformed our setup:

- **Streamlined Updates and Consistency**:  
  By hosting shared components on a designated app, we eliminated the need for constant npm updates and redeployments across teams. Other apps accessed these components via a predetermined URL, which allowed them to pull in the latest version directly from the host app. This meant that as soon as we updated a component, every app immediately had access to the latest version—no more manual syncing or deployment delays.

  However, using Module Federation for dynamic loading wasn’t entirely without quirks. We encountered a few specific challenges:

    - **Cache Validation**: To ensure clients received the latest version of components, we had to manage caching carefully. Module Federation uses a `remoteEntry.js` file to communicate what’s being exposed by the host. We implemented cache-busting by adding a timestamp query string to each build, which forced the client to invalidate its cache and load the latest `remoteEntry.js` file with every new deployment.

    - **CSS Conflicts**: With multiple apps sharing components, we ran into CSS override issues due to duplicate class names (We were using SCSS back then). This caused unexpected styling issues when components from different apps had identically named classes. To address this, we either have to scope our CSS properly or make the class names unique across apps, ensuring that each app’s styles remained isolated to avoid these collisions. Nowadays, there is tailwind and other similar atomic css solution that can prevent this type of issue by default.

    - **Async Loading in Entry Points**: To give the Module Federation plugin time to register, we needed to asynchronously load the app at its entry point. This ensured that shared modules were registered correctly before the app loaded, preventing errors and making the dynamic imports work smoothly.

  With these adjustments in place, Module Federation’s dynamic loading allowed us to stay agile without worrying about synchronization issues. Even if one team pushed multiple updates a day, other apps automatically pulled in the latest version without manual intervention. This kept users’ experiences consistent across apps and prevented the misalignment we had struggled with before.

![shared_components](https://fly.storage.tigris.dev/wispy-rain-6357/assets/images/module_shared_components.svg)

- **Smooth, Seamless Navigation with an App Shell**:  
  To create a unified user experience, we used an app shell that acted as a central “wrapper” around each of the seven apps in the quoting flow. This shell did more than just house the apps; it controlled the flow, pre-loaded assets for the upcoming app when needed, and coordinated navigation, making transitions feel effortless. Instead of reloading a new “site” each time a user advanced to the next step, the app shell treated each app like a virtual page within a single experience.

  Here’s where React Router came in handy. With React Router managing transitions inside the shell, users could navigate between apps without the clunky page reloads that broke the flow. Each app loaded within the shell as if it were just another route, and to the user, it all felt like one continuous journey. This also allowed us to handle things like routing parameters and state without dealing with complex inter-app communication or duplication.

    - **Pre-Loading for Faster, Anticipated Transitions**:  
      One of the most impactful benefits of using Module Federation was the ability to pre-load assets for the next app when we knew it required app navigation. The app shell could anticipate these steps and begin fetching assets for the next app before the user clicked, so transitions were near-instantaneous. This pre-loading was selectively triggered only when we knew it was required, allowing us to optimize performance without unnecessary bandwidth usage.

    - **Seamless Integration with React Router**:  
      Surprisingly, integrating Module Federation with React Router worked out of the box! React Router managed transitions effortlessly within the app shell, treating each app as a virtual route and allowing users to navigate between apps seamlessly. This meant each app behaved like a natural extension of the last, making the entire quoting flow feel like one cohesive experience without custom routing configurations.
  
![navigation](https://fly.storage.tigris.dev/wispy-rain-6357/assets/images/module_federation_navigation.svg)

In the end, Module Federation proved to be the perfect solution for us. Instead of the constant back-and-forth of package updates, we could simply host shared components on one app, letting all other apps fetch the latest version directly. And with our app shell managing navigation and pre-loading, we achieved a seamless, unified experience across the entire quoting process. Module Federation allowed us to keep things fast, responsive, and refresh-free—transforming our multi-app architecture into a smooth, cohesive flow.
