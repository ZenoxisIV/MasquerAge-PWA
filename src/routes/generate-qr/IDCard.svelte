<script lang="ts">
    import QrCode from "svelte-qrcode";

    export let lastName;
    export let firstName;
    export let middleName;
    export let dateOfBirth;
    export let pcn;

    export let qrCodeData;

    const formattedDOB = new Date(dateOfBirth).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
</script>

<main>
    <div class="id-card mx-auto">
        <div class="photo">
            <p class="id-number">{pcn}</p>
            <img src="https://cdn-icons-png.flaticon.com/512/3342/3342047.png" alt="Profile" />
        </div>
        <div class="details">
            <p class="profile-field">Apelyido/Last Name</p>
            <p class="profile-entry">{lastName.toUpperCase()}</p>
            <p class="profile-field">Mga Pangalan/Given Name</p>
            <p class="profile-entry">{firstName.toUpperCase()}</p>
            <p class="profile-field">Gitnang Apelyido/Middle Name</p>
            <p class="profile-entry">{middleName.toUpperCase()}</p>
            <p class="profile-field">Petsa ng Kapanganakan/Date of Birth</p>
            <p class="profile-entry">{formattedDOB}</p>
        </div>
        <div class="qr-code">
            <QrCode value={qrCodeData} size=500 />
        </div>
    </div>
</main>

<style>
    .id-card {
        display: flex;
        border: 1px solid #ccc;
        padding: 10px;
        width: 85%;
        height: 275px;
        align-items: center;
        background-color: white;
        border-radius: 10px;
    }

    .id-number {
        font-weight: bold;
        margin-bottom: 5px;
        font-size: small;
        color: black;
        white-space: nowrap;
    }

    .photo {
        flex: 1;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .photo img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 50%;
    }

    .details {
        flex: 2;
        padding-left: 10px;
    }

    .qr-code {
        flex: 1;
        text-align: center;
    }

    .profile-field {
        font-size: smaller;
        font-style: italic;
        color: black;
    }

    .profile-entry {
        font-weight: bold;
        margin-bottom: 5px;
        color: black;
    }
</style>