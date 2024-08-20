import { authService } from "./services/auth-service";
import { walletService } from "./services/wallet-service";
import {
	getSession,
	isSessionActive,
	loginUser,
	signUserOut,
	signUserUp,
} from "./usecases/auth-usecase";
import {
	createWallet,
	deleteWallet,
	getWallet,
	interWalletTransfer,
	sameUserWalletTransfer,
	walletSelfDeposit,
} from "./usecases/wallet-usecase";

signUserUp({
	email: "admin@dave.com",
	password: "admin1234",
	name: "Admin User",
});

const user = loginUser({
	email: "admin@dave.com",
	password: "admin1234",
});

// should give an error
const signupUserAgain = signUserUp({
	email: "admin@dave.com",
	password: "admin1234",
	name: "Admin User",
});

const signupUser2 = signUserUp({
	email: "test@admin.com",
	password: "maintesting",
	name: "Test admin",
});

// should error
const user2 = loginUser({
	email: "test@admin.co",
	password: "maintesting",
});

const realUser2 = loginUser({
	email: "test@admin.com",
	password: "maintesting",
});

console.log(user);
console.log(signupUserAgain);
console.log(signupUser2);
console.log(user2);
console.log(realUser2);

if (user.status === "success" && realUser2.status === "success") {
	const userSession = getSession(user.data.token);
	const user2Session = getSession(realUser2.data.token);

	if (userSession.status === "success" && user2Session.status === "success") {
		const userNairaWallet = createWallet({
			user: user.data.user,
			session: userSession.data,
		});
		const userDollarWallet = createWallet({
			user: user.data.user,
			session: userSession.data,
			currency: "USD",
		});

		if (userNairaWallet.status === "success") {
			walletSelfDeposit({
				user: user.data.user,
				walletId: userNairaWallet.data.id,
				amount: 30000,
				currency: "NGN",
				session: userSession.data,
			});
			walletSelfDeposit({
				user: user.data.user,
				walletId: userNairaWallet.data.id,
				amount: 30, // 45,000
				currency: "USD",
				session: userSession.data,
			});
			// amount in balance should be 75,000
			console.log("User Naira wallet", userNairaWallet);
		}

		if (userDollarWallet.status === "success") {
			walletSelfDeposit({
				user: user.data.user,
				walletId: userDollarWallet.data.id,
				amount: 300000, //200USD
				currency: "NGN",
				session: userSession.data,
			});
			walletSelfDeposit({
				user: user.data.user,
				walletId: userDollarWallet.data.id,
				amount: 300,
				currency: "USD",
				session: userSession.data,
			});
			// amount in balance should be 500
			console.log("User Dollar wallet", userDollarWallet);
		}

		if (
			userNairaWallet.status === "success" &&
			userDollarWallet.status === "success"
		) {
			sameUserWalletTransfer({
				user: user.data.user,
				session: userSession.data,
				amount: 30000, // 20USD
				sourceWalletId: userNairaWallet.data.id,
				targetWalletId: userDollarWallet.data.id,
			});
			// amount in balance should be 45,000
			console.log("User naira wallet", userNairaWallet);
			// amount in balance should be 520
			console.log("User dollar wallet", userDollarWallet);
		}

		const user2NairaWallet = createWallet({
			user: realUser2.data.user,
			session: user2Session.data,
		});
		const user2DollarWallet = createWallet({
			user: realUser2.data.user,
			session: user2Session.data,
			currency: "USD",
		});

		console.log("User 2 naira wallet", user2NairaWallet);
		console.log("User 2 dollar wallet", user2DollarWallet);

		if (
			userNairaWallet.status === "success" &&
			user2NairaWallet.status === "success"
		) {
			interWalletTransfer({
				user: user.data.user,
				session: userSession.data,
				amount: 20000,
				sourceWalletId: userNairaWallet.data.id,
				targetWalletId: user2NairaWallet.data.id,
			});
			// amount should be 25,000
			console.log("user naira wallet", userNairaWallet);
			// amount should be 20,000
			console.log("User2 naira wallet", user2NairaWallet);
		}

		if (
			userDollarWallet.status === "success" &&
			user2NairaWallet.status === "success"
		) {
			interWalletTransfer({
				user: user.data.user,
				session: userSession.data,
				amount: 300, // 450000NGN
				sourceWalletId: userDollarWallet.data.id,
				targetWalletId: user2NairaWallet.data.id,
			});
			// amount should be 220
			console.log("User dollar wallet", userDollarWallet);
			// amount should be 470,000
			console.log("User2 naira wallet", user2NairaWallet);
		}

		if (
			user2NairaWallet.status === "success" &&
			user2DollarWallet.status === "success"
		) {
			sameUserWalletTransfer({
				user: realUser2.data.user,
				session: user2Session.data,
				amount: 300000,
				sourceWalletId: user2NairaWallet.data.id,
				targetWalletId: user2DollarWallet.data.id,
			});
			// amount should be 170,000
			console.log("User2 naira wallet", user2NairaWallet);
			// amount should be 200
			console.log("User2 dollar wallet", user2DollarWallet);
		}

		if (
			userNairaWallet.status === "success" &&
			user2NairaWallet.status === "success"
		) {
			const delDetails = deleteWallet({
				session: user2Session.data,
				user: user.data.user,
				walletId: userNairaWallet.data.id,
			});
			// should error out as session and user do not match
			console.log(delDetails);

			const delDetails2 = deleteWallet({
				session: userSession.data,
				user: user.data.user,
				walletId: userNairaWallet.data.id,
			});
			// should error as there is still funds in the account
			console.log(delDetails2);

			interWalletTransfer({
				user: user.data.user,
				session: userSession.data,
				amount: 25000,
				sourceWalletId: userNairaWallet.data.id,
				targetWalletId: user2NairaWallet.data.id,
			});

			const delDetails3 = deleteWallet({
				session: user2Session.data,
				user: realUser2.data.user,
				walletId: userNairaWallet.data.id,
			});
			// should error out as wrong user details so permission is denied
			console.log(delDetails3);

			const delDetails4 = deleteWallet({
				session: userSession.data,
				user: user.data.user,
				walletId: userNairaWallet.data.id,
			});
			// should be successfully deleted
			console.log(delDetails4);
		}

		if (
			userNairaWallet.status === "success" &&
			userDollarWallet.status === "success" &&
			user2DollarWallet.status === "success" &&
			user2NairaWallet.status === "success"
		) {
			const userNaira = getWallet({
				user: user.data.user,
				session: userSession.data,
				walletId: userNairaWallet.data.id,
			});
			// it should not exist as it has been deleted
			console.log(userNaira);

			const userDollar = getWallet({
				user: user.data.user,
				session: userSession.data,
				walletId: userDollarWallet.data.id,
			});
			// details shown
			console.log(userDollar);

			const user2Dollar = getWallet({
				user: realUser2.data.user,
				session: user2Session.data,
				walletId: user2DollarWallet.data.id,
			});
			// details shown
			console.log(user2Dollar);

			const user2Naira = getWallet({
				user: realUser2.data.user,
				session: user2Session.data,
				walletId: user2NairaWallet.data.id,
			});
			// details shown
			console.log(user2Naira);
		}
	}
}

if (user.status === "success") {
	console.log(isSessionActive(user.data.token));
	signUserOut(user.data.token);
	// should error. No session is active
	console.log(isSessionActive(user.data.token));
}

console.log(authService.getAllUsers());
console.log(walletService.getAllWallets());
console.log(authService.getAllSesions());
console.log(walletService.getAllTransactions());
