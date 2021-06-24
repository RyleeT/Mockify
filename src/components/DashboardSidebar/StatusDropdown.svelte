<script>
  import { page } from '$app/stores';
  import { PLAN_STATUS_COLORS } from '@metafy/lib/constants';

  import SidebarItem from './SidebarItem.svelte';
  import StatusItem from './StatusItem.svelte';
  import DropdownContainer from './DropdownContainer.svelte';

  import MenuIcon from '@metafy/assets/svgs/account_dashboard/menu_icon.svg';
  import CalendarIcon from '@metafy/assets/svgs/account_dashboard/calendar_icon.svg';
  import LessonIcon from '@metafy/assets/svgs/account_dashboard/lesson_icon.svg';
  import WarningIcon from '@metafy/assets/svgs/account_dashboard/waning_icon.svg';

  export let type = 'live';
  export let href = '';
  export let isMobile = false;

  const statusConfigs = {
    replay: {
      icon: MenuIcon,
      name: 'Replay Reviews',
      list: [
        {
          href: '/account/reviews/drafts',
          type: 'drafts',
          title: 'Not submitted',
          icon: WarningIcon,
          color: 'bg-functional-y20'
        },
        {
          href: '/account/reviews/pending',
          type: 'pending',
          title: 'Pending',
          color: 'bg-functional-y20'
        },
        {
          href: '/account/reviews/confirmed',
          type: 'confirmed',
          title: 'In progress',
          color: 'bg-functional-r50'
        },
        {
          href: '/account/reviews/completed',
          type: 'completed',
          title: 'Completed',
          color: 'bg-functional-g20'
        }
      ]
    },
    live: {
      icon: CalendarIcon,
      name: 'Live Sessions',
      list: [
        {
          href: '/account/sessions/pending',
          type: 'pending',
          title: 'Pending',
          color: 'bg-functional-y20'
        },
        {
          href: '/account/sessions/upcoming',
          type: 'upcoming',
          title: 'Upcoming',
          color: 'bg-functional-b10'
        },
        {
          href: '/account/sessions/completed',
          type: 'completed',
          title: 'Completed',
          color: 'bg-functional-g20'
        },
        {
          href: '/account/sessions/canceled',
          type: 'canceled',
          title: 'Canceled',
          color: 'bg-neutrals-l40'
        }
      ]
    },
    lesson: {
      icon: LessonIcon,
      name: 'Training Plans',
      list: [
        {
          href: '/account/plans/pending',
          type: 'pending',
          title: 'Pending',
          color: PLAN_STATUS_COLORS['pending'].background
        },
        {
          href: '/account/plans/in-progress',
          type: 'in-progress',
          title: 'In Progress',
          color: PLAN_STATUS_COLORS['confirmed'].background
        },
        {
          href: '/account/plans/completed',
          type: 'completed',
          title: 'Completed',
          color: PLAN_STATUS_COLORS['completed'].background
        }
      ]
    }
  };

  $: config = statusConfigs[type];
  $: activeItem = (config?.list || []).find((x) => $page.path.startsWith(x.href));
  $: expand = !!activeItem;
</script>

<SidebarItem
  icon={config.icon}
  name={config.name}
  active={!!activeItem}
  {href}
  {isMobile}
  on:click={() => (expand = !expand)}
/>
{#if expand && !isMobile}
  <DropdownContainer class="mb-3.5">
    {#each config.list as status}
      <StatusItem {status} active={activeItem?.type === status.type} />
    {/each}
  </DropdownContainer>
{/if}
