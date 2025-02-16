<script lang="ts">
    import QrCode from "svelte-qrcode";

    export let lastName;
    export let firstName;
    export let middleName;
    export let dateOfBirth;
    export let pcn;

    export let qrCodeData;
    export let photo;

    const formattedDOB = new Date(dateOfBirth).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
</script>

<main>
    <div class="mx-auto flex border border-gray-300 p-4 w-11/12 h-72 items-center bg-white rounded-lg">
        <div class="flex-1 text-center flex flex-col items-center">
            {#if pcn}
                <p class="font-bold mb-1 text-sm text-black whitespace-nowrap">{pcn}</p>
            {/if}
            {#if photo}
                <img src={`data:image/png;base64,${photo}`} alt="Profile" />
            {:else}
                <img src="https://cdn-icons-png.flaticon.com/512/3342/3342047.png" alt="Profile" class="w-24 h-24 object-cover rounded-full" />
            {/if}
        </div>
        <div class="flex-2 pl-2">
            <p class="text-xs italic text-black">Apelyido/Last Name</p>
            <p class="font-bold mb-1 text-black">{lastName.toUpperCase()}</p>
            <p class="text-xs italic text-black">Mga Pangalan/Given Name</p>
            <p class="font-bold mb-1 text-black">{firstName.toUpperCase()}</p>
            <p class="text-xs italic text-black">Gitnang Apelyido/Middle Name</p>
            <p class="font-bold mb-1 text-black">{middleName.toUpperCase()}</p>
            <p class="text-xs italic text-black">Petsa ng Kapanganakan/Date of Birth</p>
            <p class="font-bold mb-1 text-black">{formattedDOB}</p>
        </div>
        {#if qrCodeData}
            <div class="flex-1 text-center pl-6">
                <QrCode value={qrCodeData} size=275 />
            </div>
        {/if}
    </div>
</main>

<style>

</style>