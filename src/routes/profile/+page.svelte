<script lang="ts">
	import { Button } from 'flowbite-svelte';

    export let data;

	let profile = {
		firstName: "Juan",
		middleName: "Martinez",
		lastName: "Dela Cruz",
		suffix: "Jr.",
		sex: "Male",
		dateOfBirth: "1990-01-01",
		placeOfBirth: "Manila City, Metro Manila",
		maritalStatus: "Single",
		bloodType: "O+",
		imageSrc: "http://www.rw-designer.com/icon-view/18775.png"
	};
</script>

<section class="p-4 md:p-8 max-w-5xl mx-auto">
	<h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Profile Settings</h3>

	<div class="flex flex-col md:flex-row gap-8 md:gap-10">
        <div class="w-full md:w-48 flex-shrink-0 text-center">
            <img src={profile.imageSrc} alt="Profile" class="rounded-full w-32 h-32 object-cover border mb-2 mx-auto" />
            <p class="text-sm text-gray-600 dark:text-gray-400">{data.user?.username}</p>
        </div>

		<div class="flex-1 space-y-6">
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
				<div>
					<label for="firstName" class="block text-sm font-medium mb-1">First Name</label>
					<input id="firstName" value={profile.firstName} class="block w-full border rounded-md p-2" readonly />
				</div>
				<div>
					<label for="middleName" class="block text-sm font-medium mb-1">Middle Name</label>
					<input id="middleName" value={profile.middleName} class="block w-full border rounded-md p-2" readonly />
				</div>
				<div>
					<label for="lastName" class="block text-sm font-medium mb-1">Last Name</label>
					<input id="lastName" value={profile.lastName} class="block w-full border rounded-md p-2" readonly />
				</div>
				<div>
					<label for="suffix" class="block text-sm font-medium mb-1">Suffix</label>
					<input id="suffix" value={profile.suffix} class="block w-full border rounded-md p-2" readonly />
				</div>
				<div>
					<label for="sex" class="block text-sm font-medium mb-1">Sex</label>
					<input id="sex" value={profile.sex} class="block w-full border rounded-md p-2" readonly />
				</div>
				<div>
					<label for="dateOfBirth" class="block text-sm font-medium mb-1">Date of Birth</label>
					<input id="dateOfBirth" value={profile.dateOfBirth} class="block w-full border rounded-md p-2" readonly />
				</div>
				<div>
					<label for="placeOfBirth" class="block text-sm font-medium mb-1">Place of Birth</label>
					<input id="placeOfBirth" value={profile.placeOfBirth} class="block w-full border rounded-md p-2" readonly />
				</div>
				<div>
					<label for="maritalStatus" class="block text-sm font-medium mb-1">Civil Status</label>
					<input id="maritalStatus" value={profile.maritalStatus} class="block w-full border rounded-md p-2" readonly />
				</div>
				<div>
					<label for="bloodType" class="block text-sm font-medium mb-1">Blood Type</label>
					<input id="bloodType" value={profile.bloodType} class="block w-full border rounded-md p-2" readonly />
				</div>
			</div>

			<div class="pt-4">
				<Button type="button" disabled>
					Scan MOSIP ID
				</Button>
			</div>
		</div>
	</div>
</section>
