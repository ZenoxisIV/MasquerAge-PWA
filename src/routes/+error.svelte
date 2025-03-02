<script lang="ts">
    import { Button, P } from 'flowbite-svelte';
</script>

<main class="bg-primary-50 dark:bg-[#0f1c24]">
    <div class="flex flex-col items-center justify-center mx-auto md:h-screen pt:mt-0 dark:bg-[#0f1c24]">
        <div class="text-center xl:max-w-4xl">
            <h2 class="mb-2 text-2xl font-semibold text-gray-700 dark:text-gray-300">
                404
            </h2>
            <h1 class="mb-3 text-5xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
                Page not found
            </h1>
            <P class="mb-5 text-base font-normal text-gray-500 dark:text-gray-400 md:text-lg">
                Oops! Looks like you followed a bad link. If you think this is a problem with us, please tell us.
            </P>
            <Button href="/">
                <svg
                    class="-ml-1 mr-2 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    ><path
                        fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                    /></svg
                >
                Go back home
            </Button>
        </div>
    </div>
</main>
