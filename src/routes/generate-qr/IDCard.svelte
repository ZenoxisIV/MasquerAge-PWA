<script lang="ts">
    export let lName;
    export let fName;
    export let mName;
    export let DOB;

    const formattedDOB = new Date(DOB).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
</script>

<main>
    <div class="id-card">
        <div class="photo">
            <img src="https://cdn-icons-png.flaticon.com/512/3342/3342047.png" alt="Profile" />
        </div>
        <div class="details">
            <p class="profile-field">Apelyido/Last Name</p>
            <p class="profile-entry">{lName.toUpperCase()}</p>
            <p class="profile-field">Mga Pangalan/Given Name</p>
            <p class="profile-entry">{fName.toUpperCase()}</p>
            <br>
            <p class="profile-field">Gitnang Apelyido/Middle Name</p>
            <p class="profile-entry">{mName.toUpperCase()}</p>
            <p class="profile-field">Petsa ng Kapanganakan/Date of Birth</p>
            <p class="profile-entry">{formattedDOB.toUpperCase()}</p>
        </div>
    </div>
</main>

<style>
    .id-card {
        display: flex;
        border: 1px solid #ccc;
        padding: 10px;
        width: 450px;
    }

    .photo {
        flex: 1;
        text-align: center;
    }

    .photo img {
        width: 100px;
        height: 00px;
        object-fit: cover;
        border-radius: 50%;
    }

    .details {
        flex: 2;
        padding-left: 10px;
    }

    .profile-field {
        font-size: smaller;
        font-style: italic;
    }

    .profile-entry {
        font-weight: bold;
        margin-bottom: 5px;
    }
</style>