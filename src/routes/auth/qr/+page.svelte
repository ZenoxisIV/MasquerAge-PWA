<script lang='ts'>
    import type { PageProps } from "./$types";
    import { source } from 'sveltekit-sse';

    let { data }: PageProps = $props();

    let sessionId = $derived(data.sessionId);
    let src = $derived(source(`/api/scan/${sessionId}`));
    let status = $derived(src.select('message'));
    let result = $derived(src.select('result'));

    const pcn = '1128-4572-2969-9457';
    const dob = '1985/04/29';

    const handleClick = async (method: string) => {
        const { userId } = data;
        const res = await fetch(`/api/scan/${data.sessionId}`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(method === 'PUT' ?
                { userId } : { userId, pcn, dob }
            )
        })
    }
</script>

<div>{$status}</div>
<div>{sessionId}</div>
<button onclick={() => handleClick('PUT')}>post</button>
<button onclick={() => handleClick('PATCH')}>patch</button>
{#if $status === 'authComplete'}
{@const { isLegalAge } = JSON.parse($result)}
<div>{isLegalAge}</div>
{/if}