frappe.treeview_settings["Account"] = {
	breadcrumbs: "Accounts",
	title: __("Chart Of Accounts"),
	get_tree_root: false,
	filters: [{
		fieldname: "company",
		fieldtype:"Select",
		options: $.map(locals[':Company'], function(c) { return c.name; }).sort(),
		label: __("Company"),
		default: frappe.defaults.get_default('company') ? frappe.defaults.get_default('company'): ""
	}],
	root_label: "Accounts",
	get_tree_nodes: 'erpnext.accounts.utils.get_children',
	add_tree_node: 'erpnext.accounts.utils.add_ac',
	menu_items:[
		{
			label: __('New Company'),
			action: function() { frappe.new_doc("Company", true) },
			condition: 'frappe.boot.user.can_create.indexOf("Company") !== -1'
		}
	],
	fields: [
		{fieldtype:'Data', fieldname:'account_name', label:__('New Account Name'), reqd:true,
			description: __("Name of new Account. Note: Please don't create accounts for Customers and Suppliers")},
		{fieldtype:'Check', fieldname:'is_group', label:__('Is Group'),
			description: __('Further accounts can be made under Groups, but entries can be made against non-Groups')},
		{fieldtype:'Select', fieldname:'root_type', label:__('Root Type'),
			options: ['Asset', 'Liability', 'Equity', 'Income', 'Expense'].join('\n')},
		{fieldtype:'Select', fieldname:'account_type', label:__('Account Type'),
			options: ['', 'Bank', 'Cash', 'Stock', 'Tax', 'Chargeable', 'Fixed Asset'].join('\n'),
			description: __("Optional. This setting will be used to filter in various transactions.")
		},
		{fieldtype:'Float', fieldname:'tax_rate', label:__('Tax Rate'),
			depends_on: 'eval:doc.is_group==1&&doc.account_type=="Tax"'},
		{fieldtype:'Link', fieldname:'warehouse', label:__('Warehouse'), options:"Warehouse",
			depends_on: 'eval:(!doc.is_group&&doc.account_type=="Warehouse")'},
		{fieldtype:'Link', fieldname:'account_currency', label:__('Currency'), options:"Currency",
			description: __("Optional. Sets company's default currency, if not specified.")}
	],
	onrender: function(node) {
		var dr_or_cr = node.data.balance < 0 ? "Cr" : "Dr";
		if (node.data && node.data.balance!==undefined) {
			$('<span class="balance-area pull-right text-muted small">'
				+ (node.data.balance_in_account_currency ?
					(format_currency(Math.abs(node.data.balance_in_account_currency),
						node.data.account_currency) + " / ") : "")
				+ format_currency(Math.abs(node.data.balance), node.data.company_currency)
				+ " " + dr_or_cr
				+ '</span>').insertBefore(node.$ul);
		}
	}
}