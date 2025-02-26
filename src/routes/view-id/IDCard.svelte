<script lang="ts">
    import QrCode from "svelte-qrcode";

    export let pcn: string;
    export let lastName: string;
    export let firstName: string;
    export let middleName: string;
    export let dateOfBirth: string;
    export let sex: string;
    export let bloodType: string;
    export let civilStatus: string;
    export let qrCodeData: any;
    export let photo: string;

    const formattedDOB = new Date(dateOfBirth).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }).toUpperCase();

    let isFlipped: boolean = false;

    function toggleFlip(): void {
        isFlipped = !isFlipped;
    }
</script>

<div 
    class="w-[46rem] h-[27rem] perspective-1000 cursor-pointer mx-auto mt-10" 
    on:click={toggleFlip}
    on:keydown={(e) => e.key === "Enter" || e.key === " " ? toggleFlip() : null}
    role="button"
    tabindex="0"
    aria-label="Identification Card"
>
    <div class={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        <!-- Front -->
        <div class="absolute w-full h-full backface-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-blue-500 via-white to-red-500 text-black p-8" 
            aria-hidden={isFlipped}
        >
            <div class="flex flex-col items-center">
                <div class="text-center text-sm">
                    <p class="font-bold">REPUBLIKA NG PILIPINAS</p>
                    <p>Republic of the Philippines</p>
                    <p class="font-bold mt-2">PAMBANSANG PAGKAKAKILANLAN</p>
                    <p>Philippine Identification Card</p>
                </div>
            </div>
            <div class="flex flex-row justify-between items-center mt-8">
                <div class="flex flex-col items-center">
                    <p class="text-lg font-bold text-center">{pcn}</p>
                    <img 
                        src={`data:image/png;base64,${photo}`} 
                        alt="Profile picture of {firstName} {lastName}" 
                        class="w-32 h-32 mb-4" 
                    />
                </div>
                <div class="text-sm space-y-4">
                    <div>
                        <p class="italic">APELYIDO/LAST NAME</p>
                        <p class="font-bold">{lastName.toUpperCase()}</p>
                    </div>
                    <div>
                        <p class="italic">MGA PANGALAN/GIVEN NAMES</p>
                        <p class="font-bold">{firstName.toUpperCase()}</p>
                    </div>
                    <div>
                        <p class="italic">GITNANG APELYIDO/MIDDLE NAME</p>
                        <p class="font-bold">{middleName.toUpperCase()}</p>
                    </div>
                    <div>
                        <p class="italic">PETSA NG KAPANGANAKAN/DATE OF BIRTH</p>
                        <p class="font-bold">{formattedDOB}</p>
                    </div>
                </div>
                {#if pcn}
                    <div class="flex justify-center items-center mr-2">
                        <QrCode value={pcn.replace("-", "")} size=150 aria-label="QR code for PCN {pcn}" />
                    </div>
                {/if}
            </div>
        </div>
    
        <!-- Back -->
        <div class="absolute w-full h-full backface-hidden rotate-y-180 rounded-3xl shadow-2xl bg-gradient-to-br from-blue-500 via-white to-red-500 text-black p-8 border-2" 
            aria-hidden={!isFlipped}
        >
            <div class="flex justify-between items-center h-full">
                <div class="text-sm space-y-4 text-left">
                    <div>
                        <p class="italic">KASARIAN / SEX</p>
                        <p class="font-bold">{sex.toUpperCase()}</p>
                    </div>
                    <div>
                        <p class="italic">URI NG DUGO / BLOOD TYPE</p>
                        <p class="font-bold">{bloodType.toUpperCase()}</p>
                    </div>
                    <div>
                        <p class="italic">KALAGAYANG SIBIL / MARITAL STATUS</p>
                        <p class="font-bold">{civilStatus.toUpperCase()}</p>
                    </div>
                </div>
                {#if qrCodeData}
                    <div class="flex justify-center items-center mr-2">
                        <QrCode value={pcn} size=200 aria-label="QR code for additional information" />
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .perspective-1000 {
        perspective: 1000px;
    }

    .transform-style-preserve-3d {
        transform-style: preserve-3d;
    }

    .backface-hidden {
        backface-visibility: hidden;
    }

    .rotate-y-180 {
        transform: rotateY(180deg);
    }
</style>