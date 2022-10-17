import { GetSitRep } from 'sitrep.js'
import { FormatMoney } from 'utils.js'

/** @param {NS} ns */
export async function main(ns) {
	const sitrep = GetSitRep(ns);
	if (sitrep.targetFactions == undefined || sitrep.targetFactions.length == 0) return;

	const allowed = ['Daedalus', 'BitRunners'];

	for (const faction of sitrep.targetFactions) {
		if (!allowed.includes(faction)) continue;
		if (!ns.getPlayer().factions.includes(faction)) continue;
		if (ns.singularity.getFactionFavor(faction) < 150) continue;

		//ns.tprint('INFO: Maybe we should donate to ' + faction + '?');

		if (sitrep.suggestedAugs == null) {
			ns.tprint('FAIL: sitrep.suggestedAugs is null?');
			continue;
		}

		const factionAugs = sitrep.futureAugs.filter(s => s.factions.includes(faction));
		const factionRep = ns.singularity.getFactionRep(faction);

		let tobuy = 0;
		for (const aug of factionAugs) {
			let missing = aug.rep - factionRep;
			if (missing < tobuy || tobuy == 0)
				tobuy = missing;
		}

		if (tobuy > 0) {
			let cost = (tobuy * (10 ** 6)) / ns.getPlayer().mults.faction_rep;
			ns.tprint('INFO: We need ' + ns.nFormat(tobuy, '0.000a') + ' rep for ' + faction + '. Cost would be : ', ns.nFormat(cost, '0.000a'));
			if (cost * 1.25 < ns.getServerMoneyAvailable('home')) {
				ns.tprint('INFO: Donated to ' + faction);
				ns.singularity.donateToFaction(faction, cost);
			}
		}

		return;
	}
}